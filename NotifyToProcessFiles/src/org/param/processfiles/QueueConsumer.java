package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQMessageConsumer;
import org.apache.activemq.command.ActiveMQQueue;

public class QueueConsumer  {
	

	private static Session _session;
	private static MessageConsumer _consumer;

	
	public QueueConsumer(Connection connection, Session session, String queueName){
		
		try {
			_session = session;
			ActiveMQQueue topic = new ActiveMQQueue(queueName);
			System.out.println("Connected to Queue.");
			_consumer = _session.createConsumer(topic);
			_consumer.setMessageListener(new MessageListener() {
				
				public void onMessage(Message message) {
			        if (message instanceof TextMessage) {
			            TextMessage textMessage = (TextMessage) message;
			            try {
			                System.out.println("Received message JAVA: " + textMessage.getText());
			            } catch (JMSException ex) {
			                System.out.println("Error reading message: " + ex);
			            }
			        } else  {
			            System.out.println("Received: " + message);
			        }
				}
			});
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		
	}
	
}
