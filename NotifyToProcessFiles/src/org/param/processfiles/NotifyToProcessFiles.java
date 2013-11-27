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

import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConnectionFactory;

public class NotifyToProcessFiles {

	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
	
	private static ActiveMQConnectionFactory _amqFactory;
	private static Connection _amqconnection;
	private static Session _amqsession;
	private static QueueConsumer amqConsumer;
	private static QueueProducer amqProducer;

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws JMSException, IOException {

		try 
		{
			_amqFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			_amqconnection = _amqFactory.createConnection();
			_amqconnection.start();
			_amqsession = _amqconnection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			System.out.println("Session created");
			
			
			ConnectionFactory factory = new ConnectionFactory();
			factory.setUsername("guest");
			factory.setPassword("guest");
			factory.setVirtualHost("\\");
			factory.setHost("localhost");
			factory.setPort(5672);
			com.rabbitmq.client.Connection conn = factory.newConnection();
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		
		amqProducer = new QueueProducer(_amqconnection, _amqsession, MessageQueueName);
		amqConsumer = new QueueConsumer(_amqconnection, _amqsession, MessageQueueName);
		
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
