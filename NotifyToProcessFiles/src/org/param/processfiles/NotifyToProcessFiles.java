package org.param.processfiles;

import java.io.IOException;
import java.net.URI;
import java.util.Scanner;
import java.util.Timer;

import javax.jms.Connection;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQQueue;


public class NotifyToProcessFiles {

	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
	
	private static ActiveMQConnectionFactory _connectionFactory;
	private static Connection _connection;
	private static Session _session;
	private static QueueConsumer qc;
	private static QueueProducer qp;

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws JMSException, IOException {

		try 
		{
			_connectionFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			_connection = _connectionFactory.createConnection();
			_connection.start();
			_session = _connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			System.out.println("Session created");
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		
		qp = new QueueProducer(_connection, _session, MessageQueueName);
		qc = new QueueConsumer(_connection, _session, MessageQueueName);
		
		System.out.println("Type 'exit' to stop.");
		
		
/*		try {
			_connectionFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			_connection = _connectionFactory.createConnection();
			_connection.start();
			_session = _connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
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
		}*/
		
		
		
		//Consumer c = new Consumer();
				
		
/*		Timer timer = new Timer("Printer");
		QueueProducer t = new QueueProducer();
		timer.schedule(t, 0, 1000);
		*/
		
		Scanner scan = new Scanner(System.in);
		
		boolean keepRunning = true;
		String name = null;
	    while (keepRunning)  {         
    		name =  scan.nextLine();  
	        if ("exit".equals(name))  
	        {  
	        	keepRunning = false;  
	        }  
            else  
            {  
                System.out.println("Hello " + name);  
            }  
        }
        System.out.println("Exiting.... ");  
        
		
	}

}
