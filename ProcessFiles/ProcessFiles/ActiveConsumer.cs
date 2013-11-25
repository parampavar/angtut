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

        public ActiveConsumer(IConnection amqConnection, ISession amqSession, String amqQueueName)
        {
            log.Debug("Connecting to MessageQueue...");

            ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);

            log.Info("Connected to Queue '" + amqQueueName + "'");

            try
            {
                _amqConsumer = amqSession.CreateConsumer(topic);
                log.Debug("Created a Consumer to Queue '" + amqQueueName + "'");
                _amqConsumer.Listener +=_amqConsumer_Listener;
                log.Debug("Finished Hooking up a listener to Queue '" + amqQueueName + "'");
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
            ITextMessage objectMessage = message as ITextMessage;
            if (objectMessage != null)
            {
                log.Info(objectMessage.Text);
                log.Debug(objectMessage.Text);
            }
        }

        public void Dispose()
        {
        }
    }
}
