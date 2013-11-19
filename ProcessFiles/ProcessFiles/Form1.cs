using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Configuration;

using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Apache.NMS.ActiveMQ.Commands;

using System.Collections.Specialized;

[assembly: log4net.Config.XmlConfigurator(Watch = true)]

namespace ProcessFiles
{
    public partial class Form1 : Form
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private IConnection _connection;
        private ISession _session;
        
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            _session.Close();
            _connection.Close();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            log.Info("Connecting to " + ProcessFiles.Properties.Settings.Default.MessageHost + ":" + ProcessFiles.Properties.Settings.Default.MessageHostPort);
            IConnectionFactory factory = new ConnectionFactory(Properties.Settings.Default.MessageHost + ":" + Properties.Settings.Default.MessageHostPort);
            
            _connection = factory.CreateConnection();
            //_connection.Start();
            _session = _connection.CreateSession();
            log.Info("Session Created");

            //IDestination dest = _session.GetQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);
            ActiveMQQueue topic = new ActiveMQQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);

            log.Info("Connected to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");

            using (IMessageConsumer consumer = _session.CreateConsumer(topic))
            //using (IMessageConsumer consumer = _session.CreateDurableConsumer(dest, ".NET", "2 > 1", false))
            {
                log.Info("Created a Consumer to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");


                //log.Info("Reading old messages in Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
                //////Process any messages already sitting there
                //IMessage message;
                //while ((message = consumer.Receive(TimeSpan.FromMilliseconds(2000))) != null)
                //{
                //    var objectMessage = message as ITextMessage;
                //    if (objectMessage != null)
                //        log.Info("Old Message:" + objectMessage.Text);
                //}

                log.Info("Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
                //hook up the listener to process new messages
                consumer.Listener += new MessageListener(consumer_Listener);
                _connection.Start();
                log.Info("Finished Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");

                
                while (true) ;
            }

        }

        public void consumer_Listener(IMessage message)
        {
            log.Info("Inside listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "', receiving messages.");
            ITextMessage objectMessage = message as ITextMessage;
            if (objectMessage != null)
            {
                log.Info(objectMessage.Text);
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //IDestination dest = _session.GetQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);
            ActiveMQQueue topic = new ActiveMQQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);
            //using (IMessageProducer producer = _session.CreateProducer(dest))
            using (IMessageProducer producer = _session.CreateProducer(topic))
            {
                for(int i = 0; i < 25; i++)
                {
                var objectMessage = producer.CreateTextMessage("Hello message from .NET count =" + i.ToString());
                producer.Send(objectMessage);
                }
            }

        }
    }
}
