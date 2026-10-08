const http = require('@jetbrains/youtrack-scripting-api/http');

function feedback1Origin(raw) {
  const base = String(raw || 'https://app.feedback1.ai').replace(/\/+$/, '');
  return base.replace(/\/api\/v1$/i, '');
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
        try {
          const connection = new http.Connection(feedback1Origin(ctx.settings.baseUrl));
          connection.bearerAuth(ctx.settings.apiKey);
          connection.addHeader('Accept', 'application/json');
          const response = connection.getSync('/api/v1/youtrack/issue-context', {
            issue_id: issue.id,
            id_readable: issue.idReadable,
          });
          if (response && response.isSuccess) {
            ctx.response.json(response.json());
            return;
          }
          const code = response ? response.code : 0;
          ctx.response.json({
            features: [],
            error: 'Feedback1 returned HTTP ' + code,
          });
        } catch (e) {
          ctx.response.json({
            features: [],
            error: 'Could not reach Feedback1',
          });
        }
      },
    },
  ],
};
