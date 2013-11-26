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

            ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);
            _amqProducer = amqSession.CreateProducer(topic);
            countOfMessages = 0;
            _timProducer = new Timer(2000);
            _timProducer.Elapsed += _timProducer_Elapsed;
            _timProducer.Enabled = true;
            log.Info("Producer Connected to Queue '" + amqQueueName + "'");
        }

        void _timProducer_Elapsed(object sender, ElapsedEventArgs e)
        {
            countOfMessages++;
            string msg = "Hello from .NET count =" + countOfMessages.ToString() +"'";
            var corpmessage = new CorpMessage();
            corpmessage.Text = msg;
            corpmessage.Subject = countOfMessages.ToString();
            log.Debug("Sending message json=" + Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage));
            var objectMessage = _amqProducer.CreateObjectMessage(corpmessage);
            _amqProducer.Send(objectMessage);
            _rabbitBus.Publish<CorpMessage>(corpmessage);

        }

        public void Dispose()
        {
            if (_timProducer != null) _timProducer.Close();
        }
    }
}
