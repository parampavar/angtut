using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Apache.NMS.ActiveMQ.Commands;

namespace ProcessFiles
{
    class ActiveConsumer : IDisposable
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private IMessageConsumer _amqConsumer;
        private EasyNetQ.IBus _rabbitBus;

        public ActiveConsumer(IConnection amqConnection, ISession amqSession, String amqQueueName, EasyNetQ.IBus rabbitBus)
        {
            log.Debug("Connecting to MessageQueue...");

            _rabbitBus = rabbitBus;

            ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);

            log.Info("Connected to Queue '" + amqQueueName + "'");

            try
            {
                _amqConsumer = amqSession.CreateConsumer(topic);
                log.Debug("Created a Consumer to Queue '" + amqQueueName + "'");
                _amqConsumer.Listener +=_amqConsumer_Listener;
                log.Debug("Finished Hooking up a listener to Queue '" + amqQueueName + "'");

               _rabbitBus.Subscribe<CorpMessage>(amqQueueName, _rabbitMQConsumer_Listener);

            }
            catch(Exception e)
            {
                log.Info(e.ToString());
                log.Debug(e.ToString());
            }
            finally
            {

            }
        }

        private void _amqConsumer_Listener(IMessage message)
        {
            log.Debug("Inside listener event.");
            CorpMessage objectMessage = message as CorpMessage;
            if (objectMessage != null)
            {
                log.Info(objectMessage.Text);
                log.Debug(objectMessage.Text);
            }
        }
        private void _rabbitMQConsumer_Listener(CorpMessage obj)
        {
            log.Debug("Inside RabbiitMQ listener event.");
            if (obj != null)
            {
                log.Info(obj.Text);
                log.Debug(obj.Text);
            }
        }

        public void Dispose()
        {
        }
    }
}
