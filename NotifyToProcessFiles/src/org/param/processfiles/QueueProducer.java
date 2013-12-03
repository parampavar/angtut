package org.param.processfiles;

import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQSession;
import org.apache.activemq.command.ActiveMQQueue;

public class QueueProducer {

	private static ActiveMQSession _amqSession;
	private static MessageProducer _amqProducer;	
	
	private static com.rabbitmq.client.Connection _rmqconnection;
	private static com.rabbitmq.client.Channel _rmqchannel;
	private static Timer _timProducer;
	private int countOfMessages = 0;
	
	public QueueProducer(ActiveMQConnection amqConnection, ActiveMQSession amqSession, com.rabbitmq.client.Connection rmqconnection, com.rabbitmq.client.Channel rmqchannel, String queueName) throws JMSException
	{
        ActiveMQQueue topic = new ActiveMQQueue(queueName);
        _amqSession = amqSession;
        _amqProducer = _amqSession.createProducer(topic);
        countOfMessages = 0;
        
        _rmqconnection = rmqconnection;
        _rmqchannel = rmqchannel;
        
        _timProducer = new Timer();
        _timProducer.schedule(new TimerTask() {
			
			public void run() {
	            countOfMessages++;
	            try 
				{
	            	String msg = "Hello from .JAVA count =" + Integer.toString(countOfMessages) + "'";
		            CorpMessage corpmessage = new CorpMessage();
		            corpmessage.set_text(msg);
		            corpmessage.set_subject(Integer.toString(countOfMessages));
	            	
	            	System.out.println(msg);
	            	ObjectMessage message;
					message = _amqSession.createObjectMessage(corpmessage);
		            _amqProducer.send(message);
				} 
	            catch (JMSException e) 
				{
					System.out.println("errrrr messages...");
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
/*	            
	            TextMessage message;
	            
	            try 
				{
	            	System.out.println("Hello from JAVA count =" + countOfMessages);
					message = _amqSession.createTextMessage("Hello from JAVA count =" + countOfMessages);
		            _amqProducer.send(message);
				} catch (JMSException e) 
				{
					System.out.println("errrrr messages...");
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
*/				
			}
		}, 0, 2000);
		
		System.out.println("Producer Connected to Queue '" + queueName + "'");
	}
	

}
