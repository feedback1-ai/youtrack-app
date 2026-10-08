const entities = require('@jetbrains/youtrack-scripting-api/entities');
const http = require('@jetbrains/youtrack-scripting-api/http');

function feedback1Origin(raw) {
  const base = String(raw || 'https://app.feedback1.ai').replace(/\/+$/, '');
  return base.replace(/\/api\/v1$/i, '');
}

exports.rule = entities.Issue.onChange({
  title: 'Push YouTrack State to Feedback1',
  guard: (ctx) => {
    return ctx.issue.hasTag('feedback1') && ctx.issue.fields.isChanged(ctx.State);
  },
  action: (ctx) => {
    if (!ctx.settings.apiKey) {
      return;
    }
    const issue = ctx.issue;
    const stateObj = issue.fields.State;
    const stateName = stateObj && stateObj.name ? String(stateObj.name) : '';
    if (!stateName) {
      return;
    }
    try {
      const connection = new http.Connection(feedback1Origin(ctx.settings.baseUrl));
      connection.bearerAuth(ctx.settings.apiKey);
      connection.addHeader('Content-Type', 'application/json');
      connection.addHeader('Accept', 'application/json');
      connection.postSync(
        '/api/v1/youtrack/issue-state',
        {},
        JSON.stringify({
          issue_id: issue.id,
          id_readable: issue.idReadable,
          state: stateName,
        })
      );
    } catch (e) {
      console.warn('Feedback1 State push failed: ' + e);
    }
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
    },
  },
});
