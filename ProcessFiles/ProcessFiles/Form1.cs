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
        private IMessageConsumer _consumer;
        
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            if ( _connection != null)
                _connection.Close();
            if (_session != null)
                _session.Close();
            if (_connection != null)
                _connection.Close();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            log.Info("Connecting to " + ProcessFiles.Properties.Settings.Default.MessageHost + ":" + ProcessFiles.Properties.Settings.Default.MessageHostPort);
            IConnectionFactory factory = new ConnectionFactory(Properties.Settings.Default.MessageHost + ":" + Properties.Settings.Default.MessageHostPort);
            
            _connection = factory.CreateConnection();
            _connection.Start();
            _session = _connection.CreateSession();
            log.Info("Session Created");

            ActiveMQQueue topic = new ActiveMQQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);

            log.Info("Connected to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");

            try
            {
                _consumer = _session.CreateConsumer(topic);
                log.Info("Created a Consumer to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
                _consumer.Listener += new MessageListener(consumer_Listener);

                log.Info("Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
                log.Info("Finished Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
            }
            finally
            {

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
            ActiveMQQueue topic = new ActiveMQQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);
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
