const entities = require('@jetbrains/youtrack-scripting-api/entities');
const http = require('@jetbrains/youtrack-scripting-api/http');

const FEEDBACK1_ORIGIN = 'https://app.feedback1.ai';
const LINKED_TTL_MS = 60 * 1000;
const EMPTY_TTL_MS = 15 * 1000;

function hasLinkedFeatures(payload) {
  return payload && Array.isArray(payload.features) && payload.features.length > 0;
}

function looksReadableId(value) {
  return /^[A-Za-z][A-Za-z0-9]*-\d+$/.test(value);
}

function issueQueryParams(issue) {
  const rawId = issue && issue.id != null ? String(issue.id).trim() : '';
  const readableProp =
    issue && issue.idReadable != null ? String(issue.idReadable).trim() : '';
  const readable = readableProp || (looksReadableId(rawId) ? rawId : '');
  const query = {};
  if (rawId && rawId.toLowerCase() !== 'null' && rawId.toLowerCase() !== 'undefined') {
    query.issue_id = rawId;
  }
  if (readable && readable.toLowerCase() !== 'null' && readable.toLowerCase() !== 'undefined') {
    query.id_readable = readable;
  }
  return query;
}

function isCacheFresh(cached) {
  if (!cached || !cached.fetchedAt) {
    return false;
  }
  const age = Date.now() - cached.fetchedAt;
  if (hasLinkedFeatures(cached.payload)) {
    return age < LINKED_TTL_MS;
  }
  return age < EMPTY_TTL_MS;
}

function readCache(issue) {
  const ext = issue.extensionProperties;
  const raw = ext ? ext.feedback1Context : null;
  if (!raw) {
    return null;
  }
  try {
    return {
      payload: JSON.parse(raw),
      fetchedAt: Number(ext.feedback1ContextAt || 0),
    };
  } catch (e) {
    return null;
  }
}

function writeCache(issue, payload) {
  const toStore = {
    features: Array.isArray(payload.features) ? payload.features : [],
  };
  if (payload.product) {
    toStore.product = payload.product;
  }
  if (payload.error) {
    toStore.error = payload.error;
  }
  issue.extensionProperties.feedback1Context = JSON.stringify(toStore);
  issue.extensionProperties.feedback1ContextAt = Date.now();
}

function showRevenueSetting(settings) {
  return Boolean(settings && settings.showRevenue);
}

const VOTES_FIELD_NAMES = ['\uD83D\uDC4D Votes', 'F1 Votes'];
const REVENUE_FIELD_NAMES = ['\uD83D\uDCB0 Revenue', 'F1 Revenue'];

function setFirstMatchingField(issue, names, value) {
  for (let i = 0; i < names.length; i++) {
    try {
      issue.fields[names[i]] = value;
      return true;
    } catch (e) {
      // try next alias
    }
  }
  console.warn('No matching field for ' + names.join(' / ') + ': ' + value);
  return false;
}

function setMappedOrFallbackField(ctx, prototype, fallbackNames, value) {
  const issue = ctx.issue;
  if (prototype) {
    try {
      const name = prototype.name || fallbackNames[0];
      issue.fields[name] = value;
      return;
    } catch (e) {
      console.warn('Field update failed for ' + prototype.name + ': ' + e);
    }
  }
  setFirstMatchingField(issue, fallbackNames, value);
}

function syncListFields(ctx, payload) {
  const issue = ctx.issue;
  if (!issue || !issue.fields) {
    return;
  }
  const features = Array.isArray(payload.features) ? payload.features : [];
  const primary = features.length ? features[0] : null;
  const votes = primary ? Number(primary.votes_count || 0) : 0;
  setMappedOrFallbackField(ctx, ctx.Votes, VOTES_FIELD_NAMES, votes);
  if (!showRevenueSetting(ctx.settings) || !primary) {
    return;
  }
  const revenue = Number(primary.revenue);
  if (!Number.isFinite(revenue) || revenue <= 0) {
    return;
  }
  const dollars = Math.round(revenue);
  setMappedOrFallbackField(ctx, ctx.Revenue, REVENUE_FIELD_NAMES, dollars);
}

exports.httpHandler = {
  endpoints: [
    {
      scope: 'issue',
      method: 'GET',
      path: 'issue-context',
      handle: function (ctx) {
        const issue = ctx.issue;
        if (!ctx.settings.apiKey) {
          ctx.response.json({
            features: [],
            error: 'Set the Feedback1 API key in the app settings.',
          });
          return;
        }
        const cached = readCache(issue);
        const fresh = cached && isCacheFresh(cached);
        let scheduled = false;
        if (!fresh) {
          try {
            const connection = new http.Connection(FEEDBACK1_ORIGIN, null, 15000);
            connection.bearerAuth(ctx.settings.apiKey);
            connection.addHeader('Accept', 'application/json');
            connection.getAsync(
              '/api/v1/youtrack/issue-context',
              issueQueryParams(issue),
              'onIssueContext'
            );
            scheduled = true;
          } catch (e) {
            console.warn('Feedback1 issue-context refresh could not be scheduled: ' + e);
          }
        }
        const payload = cached ? cached.payload : { features: [] };
        const pending = !cached && scheduled;
        const showRevenue = showRevenueSetting(ctx.settings);
        ctx.response.json(
          Object.assign({}, payload, {
            pending: pending,
            refreshing: scheduled,
            fetchedAt: cached ? cached.fetchedAt : null,
            showRevenue: showRevenue,
            error:
              !cached && !scheduled
                ? 'Could not reach Feedback1. Check the Feedback1 API key in the app settings.'
                : payload.error,
          })
        );
      },
    },
  ],
  asyncFunctions: {
    onIssueContext: function (ctx) {
      const response = ctx.response;
      if (response && response.isSuccess) {
        let payload;
        try {
          payload = response.json();
        } catch (e) {
          payload = { features: [], error: 'Feedback1 returned invalid JSON' };
        }
        try {
          syncListFields(ctx, payload);
        } catch (e) {
          console.warn('Feedback1 list field sync failed: ' + e);
        }
        writeCache(ctx.issue, payload);
        return;
      }
      const code = response ? response.code : 0;
      console.warn('Feedback1 issue-context failed: HTTP ' + code);
      const empty = { features: [], error: 'Feedback1 returned HTTP ' + code };
      try {
        syncListFields(ctx, empty);
      } catch (e) {
        console.warn('Feedback1 list field sync failed: ' + e);
      }
      writeCache(ctx.issue, empty);
    },
  },
  requirements: {
    Votes: {
      type: entities.Field.integerType,
      name: '\uD83D\uDC4D Votes',
    },
    Revenue: {
      type: entities.Field.integerType,
      name: '\uD83D\uDCB0 Revenue',
    },
  },
};
