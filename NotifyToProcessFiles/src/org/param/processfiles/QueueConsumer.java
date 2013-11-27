package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQMessageConsumer;
import org.apache.activemq.command.ActiveMQQueue;
import org.apache.commons.lang3.StringEscapeUtils;

import com.google.gson.Gson;

public class QueueConsumer  {
	

	private static Session _amqSession;
	private static MessageConsumer _amqConsumer;

	
	public QueueConsumer(Connection amqConnection, Session amqSession, String queueName){
		
		try {
			_amqSession = amqSession;
			ActiveMQQueue topic = new ActiveMQQueue(queueName);
			_amqConsumer = _amqSession.createConsumer(topic);
			_amqConsumer.setMessageListener(new MessageListener() {
				
				public void onMessage(Message message) {
			        if (message instanceof ObjectMessage) 
			        {
			        	ObjectMessage objMessage = (ObjectMessage)message;
			            try 
			            {
			            	CorpMessage corpMessage = (CorpMessage) objMessage.getObject() ;
			            	Gson gson = new Gson();
			            	String sGson = gson.toJson(corpMessage, corpMessage.getClass());
			            	String esJson = StringEscapeUtils.unescapeJava(sGson);
				            System.out.println("Received message JAVA: " + esJson );
			            } catch (JMSException ex) 
			            {
			                System.out.println("Error reading message: " + ex);
			            }
			        } 
			        else  
			        {
			            System.out.println("Received: " + message);
			        }
/*			        if (message instanceof TextMessage) {
			            TextMessage textMessage = (TextMessage) message;
			            try {
			                System.out.println("Received message JAVA: " + textMessage.getText());
			            } catch (JMSException ex) {
			                System.out.println("Error reading message: " + ex);
			            }
			        } else  {
			            System.out.println("Received: " + message);
			        }
*/				}
			});
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		System.out.println("Consumer connected to Queue '" + queueName + "'");
	}
	
}
