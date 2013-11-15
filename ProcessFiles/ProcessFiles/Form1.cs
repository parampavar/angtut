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

[assembly: log4net.Config.XmlConfigurator(Watch = true)]

namespace ProcessFiles
{
    public partial class Form1 : Form
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private IConnection _connection;
        private ISession _session;
        private string _QUEUE = "MY.TEST";
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
            log.Info("Info logging");
            IConnectionFactory factory = new ConnectionFactory(ConfigurationManager.AppSettings["MessageHost"] + ":" + ConfigurationManager.AppSettings["MessagePort"]);
            _connection = factory.CreateConnection();
            _connection.Start();
            _session = _connection.CreateSession();

            IDestination dest = _session.GetQueue(_QUEUE);
            using (IMessageConsumer consumer = _session.CreateConsumer(dest))
            {
                consumer.Listener += consumer_Listener;
                //IMessage message;
                //while ((message = consumer.Receive(TimeSpan.FromMilliseconds(2000))) != null)
                //{
                //    var objectMessage = message as ITextMessage;
                //    if (objectMessage != null)
                //    {
                //        objectMessage.Text = objectMessage.Text;
                //    }
                //}
            }

        }

        private void consumer_Listener(IMessage message)
        {
            MyMsg msg = null;
            var objectMessage = message as IObjectMessage;
            if (objectMessage != null)
            {
                msg = objectMessage as MyMsg;

            }
        }
    }
}
