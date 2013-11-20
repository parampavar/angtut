package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;

public class Consumer  {
	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
	
	private static ActiveMQConnectionFactory connectionFactory;
	private static Connection connection;
	private static Session session;
	public static Destination destination;
	private static MessageConsumer consumer;
	private static MyConsumer myConsumer;
	
	public Consumer(){
		
		try {
			connectionFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			connection = connectionFactory.createConnection();
			session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			destination = session.createQueue(MessageQueueName);
			consumer = session.createConsumer(destination);
			myConsumer = new MyConsumer();
			consumer.setMessageListener(myConsumer);
			System.out.println("inside Consumer");
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		
	}
	
	private static class MyConsumer implements MessageListener, ExceptionListener {

	    synchronized public void onException(JMSException ex) {
	        System.out.println("JMS Exception occured.  Shutting down client.");
	        System.exit(1);
	    }

	    public void onMessage(Message message) {
	    	System.out.println("inside onMessage");
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
	}
}
