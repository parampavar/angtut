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
    class ActiveProducer : IDisposable
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        IMessageProducer _amqProducer;
        EasyNetQ.IBus _rabbitBus;

        Timer _timProducer;
        Int32 countOfMessages;
        public ActiveProducer(IConnection amqConnection, ISession amqSession, String amqQueueName, EasyNetQ.IBus rabbitBus)
        {
            _rabbitBus = rabbitBus;
            log.Debug("Connecting to MessageQueue...");

            ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);
            _amqProducer = amqSession.CreateProducer(topic);
            countOfMessages = 0;
            _timProducer = new Timer(2000);
            _timProducer.Elapsed += _timProducer_Elapsed;
            _timProducer.Enabled = true;
            log.Info("Connected to Queue '" + amqQueueName + "'");
        }

        void _timProducer_Elapsed(object sender, ElapsedEventArgs e)
        {
            countOfMessages++;
            string msg = "Hello from .NET count =" + countOfMessages.ToString() +"'";
            log.Debug("Sending message '" + msg);
            CorpMessage message = new CorpMessage();
            message.Text = msg;
            var objectMessage = _amqProducer.CreateObjectMessage(msg);
            _amqProducer.Send(objectMessage);
            //_rabbitBus.Publish<CorpMessage>(message);

        }

        public void Dispose()
        {
            if (_timProducer != null) _timProducer.Close();
        }
    }
}
