const AuditLogger = require('./../../src/index');

describe('1) audit-logs-js => Unit tests => Basics', () => {
  let auditLogger;
  const connectionOpts = {
    NATS_SERVER: 'localhost',
    NATS_PORT: 2000
  };

  beforeEach(() => {
    auditLogger = new AuditLogger(connectionOpts);
  });

  it('has some required props (new)', () => {
    expect(auditLogger).to.have.property('log').to.be.a('function');
  });
  it('initializes with some nats options', () => {
    let logger = new AuditLogger(connectionOpts);
    expect(logger.connectionOpts).to.be.deep.equal(connectionOpts);
  });
});
