package org.param.processfiles;

import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQQueue;

public class QueueProducer {

	private static Session _amqSession;
	private static MessageProducer _amqProducer;	
	private static Timer _timProducer;
	private int countOfMessages = 0;
	
	public QueueProducer(Connection amqConnection, Session amqSession, String queueName) throws JMSException
	{
        ActiveMQQueue topic = new ActiveMQQueue(queueName);
        _amqSession = amqSession;
        _amqProducer = _amqSession.createProducer(topic);
        countOfMessages = 0;
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
