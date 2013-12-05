using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using Apache.NMS;
using Apache.NMS.ActiveMQ;
using Apache.NMS.ActiveMQ.Commands;

namespace ProcessFiles
{
    class ActiveProducer : IDisposable
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private IMessageProducer _amqProducer;
        private EasyNetQ.IBus _rabbitBus;
        private EasyNetQ.Topology.IQueue _rabbitQueue;
        private EasyNetQ.Topology.IExchange _rabbitExchange;

        Timer _timProducer;
        Int32 countOfMessages;
        public ActiveProducer(IConnection amqConnection, ISession amqSession, String amqQueueName, EasyNetQ.IBus rabbitBus, EasyNetQ.Topology.IQueue rabbitQueue, EasyNetQ.Topology.IExchange rabbitExchange)
        {
            _rabbitBus = rabbitBus;
            _rabbitExchange = rabbitExchange;
            _rabbitQueue = rabbitQueue;

            ActiveMQQueue topic = new ActiveMQQueue(amqQueueName);
            _amqProducer = amqSession.CreateProducer(topic);
            countOfMessages = 0;
            _timProducer = new Timer(2000);
            _timProducer.Elapsed += _timProducer_Elapsed;
            _timProducer.Enabled = true;
            log.Info("Producer Connected to Queue '" + amqQueueName + "'");
        }

        void _timProducer_Elapsed(object sender, ElapsedEventArgs e)
        {
            countOfMessages++;
            string msg = "Hello from .NET count =" + countOfMessages.ToString() +"'";
            var corpmessage = new CorpMessage();
            corpmessage.Text = msg;
            corpmessage.Subject = countOfMessages.ToString();

            if (countOfMessages % 2 == 0)
            {
                corpmessage.BooleanFlag = true;
                corpmessage.ByteCode = SByte.MinValue;// Byte.MinValue;
                corpmessage.CharYN = 'Y';
                corpmessage.IntNumber = (int.MinValue);
                corpmessage.LongNumber = (long.MinValue);
                corpmessage.ShortNumber = (short.MinValue);
            }
            else
            {
                corpmessage.BooleanFlag = false;
                corpmessage.ByteCode = SByte.MaxValue;
                corpmessage.CharYN = 'N';
                corpmessage.IntNumber = (int.MaxValue);
                corpmessage.LongNumber = (long.MaxValue);
                corpmessage.ShortNumber = (short.MaxValue);
            }

            if (countOfMessages % 6 == 0)
                corpmessage.DoubleNumber = (Double.MaxValue);
            else if (countOfMessages % 6 == 1)
                corpmessage.DoubleNumber = (Double.MinValue);
            else if (countOfMessages % 6 == 2)
                corpmessage.DoubleNumber = (Double.MinValue);
            else if (countOfMessages % 6 == 3)
                corpmessage.DoubleNumber = (Double.MaxValue); //corpmessage.DoubleNumber = (Double.NaN);
            else if (countOfMessages % 6 == 4)
                corpmessage.DoubleNumber = (Double.MaxValue);
            else if (countOfMessages % 6 == 5)
                corpmessage.DoubleNumber = (Double.MaxValue);
            else
                corpmessage.DoubleNumber = (Double.MaxValue);

            if (countOfMessages % 6 == 0)
                corpmessage.FloatNumber = (float.MaxValue);
            else if (countOfMessages % 6 == 1)
                corpmessage.FloatNumber = (float.MinValue);
            else if (countOfMessages % 6 == 2)
                corpmessage.FloatNumber = (float.MinValue);
            else if (countOfMessages % 6 == 3)
                corpmessage.FloatNumber = (float.MaxValue); //corpmessage.FloatNumber = (float.NaN);
            else if (countOfMessages % 6 == 4)
                corpmessage.FloatNumber = (float.MaxValue);
            else if (countOfMessages % 6 == 5)
                corpmessage.FloatNumber = (float.MaxValue);
            else
                corpmessage.FloatNumber = (float.MaxValue);

            corpmessage.StartDate = new DateTime(2012, 01, 31, 23, 59, 58, DateTimeKind.Utc);
            corpmessage.EndDate = new DateTime(2012, 12, 31, 23, 59, 58, DateTimeKind.Utc);

            Address _homeAddress = new Address();
            _homeAddress.City = ("New York");
            _homeAddress.Country = ("USA");
            _homeAddress.Postalcode = ("92452");
            _homeAddress.State = ("New York");
            _homeAddress.Street1 = ("");
            _homeAddress.Street2 = ("555 ABC Street");

            Address _workAddress = new Address();
            _workAddress.City = ("Boston");
            _workAddress.Country = ("USA");
            _workAddress.Postalcode = ("92452");
            _workAddress.State = ("Massccutess");
            _workAddress.Street1 = ("");
            _workAddress.Street2 = ("999 ABC Street");

            corpmessage.HomeAddress = _homeAddress;
            corpmessage.WorkAddress = _workAddress;

            string esJson = Newtonsoft.Json.JsonConvert.SerializeObject(corpmessage);
            log.Debug("Sending message json=" + esJson);

            var tMessage = _amqProducer.CreateTextMessage(esJson);
            _amqProducer.Send(tMessage);
            
            _rabbitBus.Advanced.Publish(_rabbitExchange, "*", false, false, new EasyNetQ.MessageProperties(), System.Text.Encoding.UTF8.GetBytes(esJson));

        }

        public void Dispose()
        {
            if (_timProducer != null) _timProducer.Close();
        }
    }
}
