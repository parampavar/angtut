package org.param.processfiles;

import java.io.IOException;
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
import org.apache.commons.lang3.SerializationUtils;

public class QueueProducer {

	private static ActiveMQSession _amqSession;
	private static MessageProducer _amqProducer;	
	
	private static com.rabbitmq.client.Connection _rmqconnection;
	private static com.rabbitmq.client.Channel _rmqchannel;
	private static Timer _timProducer;
	private int countOfMessages = 0;
	
	private static String _queueName;
	
	public QueueProducer(ActiveMQConnection amqConnection, ActiveMQSession amqSession, com.rabbitmq.client.Connection rmqconnection, com.rabbitmq.client.Channel rmqchannel, String queueName)
	{
		
		_queueName = queueName;
        ActiveMQQueue topic = new ActiveMQQueue(_queueName);
        _amqSession = amqSession;
        try 
        {
			_amqProducer = _amqSession.createProducer(topic);
		} 
        catch (JMSException e1) 
		{
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
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
					
		            _rmqchannel.basicPublish(_queueName, "*", null, SerializationUtils.serialize(corpmessage));
				} 
	            catch (IOException e) 
				{
					System.out.println("errrrr messages...");
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
	            catch (JMSException e) 
				{
					System.out.println("errrrr messages...");
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}, 0, 2000);
		
		System.out.println("Producer Connected to Queue '" + queueName + "'");
	}
	

}
