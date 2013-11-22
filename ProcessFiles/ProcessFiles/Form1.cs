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
        private IConnectionFactory _factory;
        private IConnection _connection;
        private ISession _session;
        private ActiveConsumer qc;
        private ActiveProducer qp;

        private EasyNetQ.IBus _rabbitBus;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (_connection != null)
                _connection.Close();
            if (_session != null)
                _session.Close();
            if (_connection != null)
                _connection.Close();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            IConnectionFactory factory = new ConnectionFactory(Properties.Settings.Default.MessageHost + ":" + Properties.Settings.Default.MessageHostPort);

            _connection = factory.CreateConnection();
            _connection.ClientId = ProcessFiles.Properties.Settings.Default.MessageQueueName + ".NET";
            _connection.Start();
            _session = _connection.CreateSession();
            log.Debug("Session Created.");

            try
            {
                _rabbitBus = EasyNetQ.RabbitHutch.CreateBus("localhast", 5673,
                       Properties.Settings.Default.MessageQueueName, "guest", "guest", 10,
                       x => x.Register<EasyNetQ.IEasyNetQLogger>(_ => new EasyNetLogger()));
            }
            catch (Exception ex)
            {
                
                throw;
            }
        }

        private void receiveMessages_Click(object sender, EventArgs e)
        {
            //ActiveMQQueue topic = new ActiveMQQueue(ProcessFiles.Properties.Settings.Default.MessageQueueName);

            //log.Info("Connected to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");

            //try
            //{
            //    _consumer = _session.CreateConsumer(topic);
            //    log.Info("Created a Consumer to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
            //    _consumer.Listener += new MessageListener(consumer_Listener);

            //    log.Info("Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
            //    log.Info("Finished Hooking up a listener to Queue '" + ProcessFiles.Properties.Settings.Default.MessageQueueName + "'");
            //}
            //finally
            //{

            //}
            qc = new ActiveConsumer(_connection, _session, ProcessFiles.Properties.Settings.Default.MessageQueueName);
        }

        private void sendMessages_Click(object sender, EventArgs e)
        {
            qp = new ActiveProducer(_connection, _session, ProcessFiles.Properties.Settings.Default.MessageQueueName);
        }
    }

    public class EasyNetLogger : EasyNetQ.IEasyNetQLogger
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public void DebugWrite(string format, params object[] args)
        {
            log.Debug(String.Format(format, args));
        }

        public void ErrorWrite(Exception exception)
        {
            log.Error(null, exception);
        }

        public void ErrorWrite(string format, params object[] args)
        {
            log.ErrorFormat(format, args);
        }

        public void InfoWrite(string format, params object[] args)
        {
            log.InfoFormat(format, args);
        }
    }
}
