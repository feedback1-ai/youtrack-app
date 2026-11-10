const entities = require('@jetbrains/youtrack-scripting-api/entities');
const http = require('@jetbrains/youtrack-scripting-api/http');

const FEEDBACK1_ORIGIN = 'https://app.feedback1.ai';

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
      const connection = new http.Connection(FEEDBACK1_ORIGIN);
      connection.bearerAuth(ctx.settings.apiKey);
      connection.addHeader('Content-Type', 'application/json');
      connection.addHeader('Accept', 'application/json');
      // Sent after the State change commits; never holds the write transaction.
      connection.postAsync(
        '/api/v1/youtrack/issue-state',
        null,
        JSON.stringify({
          issue_id: issue.id,
          id_readable: issue.idReadable,
          state: stateName,
        }),
        'onPushed'
      );
    } catch (e) {
      console.warn('Feedback1 State push could not be scheduled: ' + e);
    }
  },
  asyncFunctions: {
    onPushed: (ctx) => {
      const response = ctx.response;
      if (!response || !response.isSuccess) {
        console.warn(
          'Feedback1 State push failed for ' + ctx.issue.idReadable +
            ': HTTP ' + (response ? response.code : 0)
        );
      }
    },
  },
  requirements: {
    State: {
      type: entities.State.fieldType,
    },
  },
});
