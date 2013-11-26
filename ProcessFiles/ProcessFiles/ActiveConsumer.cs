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
            try
            {
                _rabbitBus = rabbitBus;
                ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);

                _amqConsumer = amqSession.CreateConsumer(topic);
                _amqConsumer.Listener +=_amqConsumer_Listener;

               _rabbitBus.Subscribe<CorpMessage>(amqQueueName, _rabbitMQConsumer_Listener);

               log.Info("Consumer Connected to Queue '" + amqQueueName + "'");
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
            //log.Debug("Inside listener event.");
            var objectMessage = message as IObjectMessage;

            if (objectMessage != null)
            {
                CorpMessage corpmessage = objectMessage.Body as CorpMessage;
                if ( corpmessage != null )
                    log.Info("ActiveMQ received message json=" + Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage));
            }
        }
        private void _rabbitMQConsumer_Listener(CorpMessage corpmessage)
        {
            //log.Debug("Inside RabbiitMQ listener event.");
            if (corpmessage != null)
                log.Info("RabbiitMQ received message json=" + Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage));
        }

        public void Dispose()
        {
        }
    }
}
