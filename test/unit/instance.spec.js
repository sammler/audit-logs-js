const AuditLogs = require('./../../src/index');

describe('2) audit-logs-js => Unit tests => Instance', () => {
  it('has some required props', () => {
    expect(AuditLogs).to.not.have.property('log').to.be.a('function');
  });
});
