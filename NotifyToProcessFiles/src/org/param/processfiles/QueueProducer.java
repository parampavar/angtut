package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQQueue;

public class QueueProducer {

	Session _session;
	MessageProducer _producer;	
	Timer _timProducer;
	private int countOfMessages = 0;
	
	public QueueProducer(Connection connection, Session session, String queueName) throws JMSException
	{
		System.out.println("Connecting to MessageQueue...");
        ActiveMQQueue topic = new ActiveMQQueue(queueName);
        _session = session;
        _producer = _session.createProducer(topic);
        countOfMessages = 0;
        _timProducer = new Timer();
        _timProducer.schedule(new TimerTask() {
			
			public void run() {
	            countOfMessages++;
	            TextMessage message;
	            System.out.println("sending messages...");
	            try 
				{
					message = _session.createTextMessage("Hello from JAVA count =" + countOfMessages);
		            _producer.send(message);
				} catch (JMSException e) 
				{
					System.out.println("errrrr messages...");
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}, 0, 2000);
		
	}
	

}
