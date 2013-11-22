package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQMessageConsumer;
import org.apache.activemq.command.ActiveMQQueue;

public class QueueConsumer  {
	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
	
	private static ActiveMQConnectionFactory _connectionFactory;
	private static Connection _connection;
	private static Session _session;
	public static MessageConsumer _consumer;

	
	public QueueConsumer(){
		
		try {
			_connectionFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			_connection = _connectionFactory.createConnection();
			_connection.start();
			_session = _connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			System.out.println("inside Consumer");
			System.out.println("Session created");

			ActiveMQQueue topic = new ActiveMQQueue(MessageQueueName);
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
	
/*	private static class MyConsumer implements MessageListener, ExceptionListener {

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
*/
}
