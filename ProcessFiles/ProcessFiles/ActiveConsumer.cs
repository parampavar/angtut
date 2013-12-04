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
        private EasyNetQ.Topology.IQueue _rabbitQueue;
        private EasyNetQ.Topology.IExchange _rabbitExchange;
        public ActiveConsumer(IConnection amqConnection, ISession amqSession, String amqQueueName, EasyNetQ.IBus rabbitBus, EasyNetQ.Topology.IQueue rabbitQueue, EasyNetQ.Topology.IExchange rabbitExchange)
        {
            try
            {
                _rabbitBus = rabbitBus;
                _rabbitExchange = rabbitExchange;
                _rabbitQueue = rabbitQueue;
                ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);
                _rabbitQueue = _rabbitBus.Advanced.QueueDeclare(amqQueueName);

                _amqConsumer = amqSession.CreateConsumer(topic);
                _amqConsumer.Listener += _amqConsumer_Listener;

                _rabbitBus.Advanced.Consume(_rabbitQueue, (body, properties, info) => Task.Factory.StartNew(() =>
                {
                    String message = System.Text.Encoding.UTF8.GetString(body);
                    CorpMessage corpmessage = Newtonsoft.Json.JsonConvert.DeserializeObject<CorpMessage>(message);
                    log.Info("RabbitMQ received message json=" + Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage));
                }));

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
            var tMessage = message as ITextMessage;

            if (tMessage != null)
            {
                CorpMessage corpmessage = new CorpMessage(); // = objectMessage.Body as CorpMessage;
                corpmessage = (CorpMessage)Newtonsoft.Json.JsonConvert.DeserializeObject(tMessage.Text, corpmessage.GetType());
                log.Info("ActiveMQ received message json=" + Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage));
            }
        }

        public void Dispose()
        {
        }

    }

    public class RabbitMQConsumerHandler :  EasyNetQ.Consumer.IHandlerRegistration
    {

        public EasyNetQ.Consumer.IHandlerRegistration Add<T>(Action<EasyNetQ.IMessage<T>, EasyNetQ.MessageReceivedInfo> handler) where T : class
        {
         
            throw new NotImplementedException();
        }

        public EasyNetQ.Consumer.IHandlerRegistration Add<T>(Func<EasyNetQ.IMessage<T>, EasyNetQ.MessageReceivedInfo, Task> handler) where T : class
        {
            throw new NotImplementedException();
        }

        public bool ThrowOnNoMatchingHandler
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }
    }
}
