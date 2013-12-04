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
        private IConnectionFactory _amqfactory;
        private IConnection _amqconnection;
        private ISession _amqsession;
        private ActiveConsumer amqConsumer;
        private ActiveProducer amqProducer;

        private EasyNetQ.IBus _rabbitBus;
        private EasyNetQ.Topology.IQueue _rabbitQueue;
        private EasyNetQ.Topology.IExchange _rabbitExchange;

        private EasyNetQ.Topology.IQueue _rabbitQueueProducer;
        private EasyNetQ.Topology.IExchange _rabbitExchangeProducer;

        private EasyNetQ.Topology.IQueue _rabbitQueueConsumer;
        private EasyNetQ.Topology.IExchange _rabbitExchangeConsumer;

        private static String MessageQueueName = "ProcessFiles";
        private static String ProduceToMessageQueueName = MessageQueueName + "-FROM.NET";
        private static String ConsumeFromMessageQueueName = MessageQueueName + "-FROMJAVA";

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (_amqconnection != null)
                _amqconnection.Close();
            if (_amqsession != null)
                _amqsession.Close();
            if (_amqconnection != null)
                _amqconnection.Close();
            if (_rabbitBus != null)
                _rabbitBus.Dispose();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

            try
            {
                IConnectionFactory factory = new ConnectionFactory(Properties.Settings.Default.MessageHost + ":" + Properties.Settings.Default.MessageHostPort);

                _amqconnection = factory.CreateConnection();
                _amqconnection.ClientId = ProcessFiles.Properties.Settings.Default.MessageQueueName + ".NET";
                _amqconnection.Start();
                _amqsession = _amqconnection.CreateSession();
                log.Debug("ActiveMQ Session Created.");

                _rabbitBus = EasyNetQ.RabbitHutch.CreateBus("host=localhost:5672");
                
                // RabbitMQ Producer setup - begin 
                _rabbitQueueProducer = _rabbitBus.Advanced.QueueDeclare(ProduceToMessageQueueName);
                _rabbitExchangeProducer = _rabbitBus.Advanced.ExchangeDeclare(ProduceToMessageQueueName, EasyNetQ.Topology.ExchangeType.Direct);
                _rabbitBus.Advanced.Bind(_rabbitExchangeProducer, _rabbitQueueProducer, "*");
                // RabbitMQ Producer setup - End 

                // RabbitMQ Consumer setup - begin 
                _rabbitQueueConsumer = _rabbitBus.Advanced.QueueDeclare(ConsumeFromMessageQueueName);
                _rabbitExchangeConsumer = _rabbitBus.Advanced.ExchangeDeclare(ConsumeFromMessageQueueName, EasyNetQ.Topology.ExchangeType.Direct);
                _rabbitBus.Advanced.Bind(_rabbitExchangeConsumer, _rabbitQueueConsumer, "*");
                // RabbitMQ Consumer setup - End 

                log.Debug("RabbitMQ Session Created.");
                //_rabbitBus = EasyNetQ.RabbitHutch.CreateBus("localhost", 5672,
                //       Properties.Settings.Default.MessageQueueName, "guest", "guest", 10,
                //       x => x.Register<EasyNetQ.IEasyNetQLogger>(_ => new EasyNetLogger()));

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //void _timRabbitMQProducer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        //{
        //    CorpMessage message = new CorpMessage();
        //    message.Text = "RabbitMQ msg from .NET count";
        //    _rabbitBus.Publish<CorpMessage>(message);
        //}

        //private void onRabbitMQMesage(CorpMessage obj)
        //{
        //    log.Debug("Inside RavvitMQ listener event.");
        //    if (obj != null)
        //    {
        //        log.Info(obj.Text);
        //        log.Debug(obj.Text);
        //    }
        //}

        private void receiveMessages_Click(object sender, EventArgs e)
        {
            amqConsumer = new ActiveConsumer(_amqconnection, _amqsession, ConsumeFromMessageQueueName, _rabbitBus, _rabbitQueueConsumer, _rabbitExchangeConsumer);
        }

        private void sendMessages_Click(object sender, EventArgs e)
        {
            amqProducer = new ActiveProducer(_amqconnection, _amqsession, ProduceToMessageQueueName, _rabbitBus, _rabbitQueueProducer, _rabbitExchangeProducer);
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
