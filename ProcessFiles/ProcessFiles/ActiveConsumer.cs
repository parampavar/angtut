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
        private IMessageConsumer _consumer;

        public ActiveConsumer(IConnection connection, ISession session, String QueueName)
        {
            log.Debug("Connecting to MessageQueue...");

            ActiveMQQueue topic = new ActiveMQQueue(QueueName);

            log.Info("Connected to Queue '" + QueueName + "'");

            try
            {
                _consumer = session.CreateConsumer(topic);
                log.Debug("Created a Consumer to Queue '" + QueueName + "'");
                _consumer.Listener +=_consumer_Listener;
                log.Debug("Finished Hooking up a listener to Queue '" + QueueName + "'");
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

        private void _consumer_Listener(IMessage message)
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
