package org.param.processfiles;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import javax.jms.JMSException;
import javax.jms.MessageProducer;
import javax.jms.ObjectMessage;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQSession;
import org.apache.activemq.command.ActiveMQQueue;
import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringEscapeUtils;

import com.google.gson.Gson;

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
	            	
	            	Gson gson = new Gson();
	            	String sGson = gson.toJson(corpmessage, corpmessage.getClass());
	            	String esJson = StringEscapeUtils.unescapeJava(sGson);
	            	
					TextMessage tmessage = _amqSession.createTextMessage(esJson);
	            	System.out.println(sGson);
	            	System.out.println(esJson);
					
		            _amqProducer.send(tmessage);
					
		            _rmqchannel.basicPublish(_queueName, "*", null, esJson.getBytes("UTF-8"));
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
