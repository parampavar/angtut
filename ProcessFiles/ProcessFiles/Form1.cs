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
            _connection.Start();
            _session = _connection.CreateSession();

            IDestination dest = _session.GetQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);
            using (IMessageConsumer consumer = _session.CreateConsumer(dest))
            {
                ////Process any messages already sitting there
                IMessage message;
                while ((message = consumer.Receive(TimeSpan.FromMilliseconds(2000))) != null)
                {
                    var objectMessage = message as ITextMessage;
                    if (objectMessage != null)
                        log.Info("Old Message:" + objectMessage.Text);
                }

                //hook up the listener to process new messages
                consumer.Listener += new MessageListener(consumer_Listener);
            }

        }

        void consumer_Listener(IMessage message)
        {
            ITextMessage objectMessage = message as ITextMessage;
            if (objectMessage != null)
            {
                log.Info(objectMessage.Text);
            }
        }
    }
}
