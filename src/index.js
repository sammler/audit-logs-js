const Logger = require('winster');
const Stan = require('node-nats-streaming');

let auditLogger;

class AuditLogger {

  constructor(connectionOpts, natsOpts) {
    this.clusterId = (connectionOpts && connectionOpts.clusterId) || 'test-cluster';
    this.clientId = (connectionOpts && connectionOpts.clientId) || 'audi-logs-js';
    this.server = (connectionOpts && connectionOpts.server) || 'nats://localhost:4222';

    this.connectionOpts = connectionOpts;
    this.natsOpts = natsOpts;
    this.logger = Logger.instance();
  }

  static instance(connectionOpts, natsOpts) {
    if (!auditLogger) {
      auditLogger = new AuditLogger(connectionOpts, natsOpts);
    }
    return auditLogger;
  }

  log(subject, cloudEvent) {

    const that = this;
    const msg = cloudEvent || {};

    if (!subject) {
      let eMsg = 'Cannot proceed with the audit-log, arg `subject` is missing.';
      this.logger.fatal(eMsg);
      throw new Error(eMsg);
    }
    if (!cloudEvent) {
      let eMsg = 'Cannot proceed with the audit-log, arg `cloudEvent` is missing.';
      this.logger.fatal(eMsg);
      throw new Error(eMsg);
    }

    let stan = Stan.connect(this.clusterId, this.clientId, this.server);

    stan.on('connect', () => {
      that.logger.verbose('we are connected');

      stan.publish(subject, JSON.stringify(msg), function (err, guid) {
        if (err) {
          that.logger.error('publish failed: ', err);
        } else {
          that.logger.verbose('published message with guid: ', guid);
        }
        stan.close();
        that.logger.verbose('we are disconnected');
      });
    });

    this.logger.verbose('OK, we have logged something ...');
  }

}

module.exports = AuditLogger;
