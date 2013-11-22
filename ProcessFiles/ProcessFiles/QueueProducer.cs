using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Apache.NMS.ActiveMQ.Commands;

namespace ProcessFiles
{
    class QueueProducer : IDisposable
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        IMessageProducer _producer;
        Timer _timProducer;
        Int32 countOfMessages;
        public QueueProducer(IConnection connection, ISession session, String QueueName)
        {
            log.Debug("Connecting to MessageQueue...");

            ActiveMQQueue topic = new ActiveMQQueue(QueueName);
            _producer = session.CreateProducer(topic);
            countOfMessages = 0;
            _timProducer = new Timer(2000);
            _timProducer.Elapsed += _timProducer_Elapsed;
            _timProducer.Enabled = true;
            log.Info("Connected to Queue '" + QueueName + "'");
        }

        void _timProducer_Elapsed(object sender, ElapsedEventArgs e)
        {
            countOfMessages++;
            log.Debug("Sending message '" + "Hello from .NET count =" + countOfMessages.ToString() +"'");
            var objectMessage = _producer.CreateTextMessage("Hello from .NET count =" + countOfMessages.ToString());
            _producer.Send(objectMessage);
        }

        public void Dispose()
        {
        }
    }
}
