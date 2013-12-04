﻿using System;
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
