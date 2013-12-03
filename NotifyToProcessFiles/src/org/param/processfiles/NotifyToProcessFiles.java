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

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQSession;
import org.apache.activemq.command.ActiveMQQueue;

//import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.ShutdownListener;
import com.rabbitmq.client.ShutdownSignalException;

public class NotifyToProcessFiles {

	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
	
	private static ActiveMQConnectionFactory _amqFactory;
	private static ActiveMQConnection _amqconnection;
	private static ActiveMQSession _amqsession;
	private static QueueConsumer amqConsumer;
	private static QueueProducer amqProducer;
	
	private static com.rabbitmq.client.ConnectionFactory _rmqfactory;
	private static com.rabbitmq.client.Connection _rmqconnection;
	private static com.rabbitmq.client.Channel _rmqchannel;

	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws JMSException, IOException {

		try 
		{
			_amqFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
			_amqconnection = (ActiveMQConnection) _amqFactory.createConnection();
			_amqconnection.start();
			_amqsession = (ActiveMQSession) _amqconnection.createSession(false, Session.AUTO_ACKNOWLEDGE);
			System.out.println("Session created");
			
			
			_rmqfactory = new ConnectionFactory();
			_rmqfactory.setUsername("guest");
			_rmqfactory.setPassword("guest");
			_rmqfactory.setVirtualHost("/");
			_rmqfactory.setHost("localhost");
			_rmqfactory.setPort(5672);
			_rmqconnection = _rmqfactory.newConnection();
			_rmqconnection.addShutdownListener( new ShutdownListener() {
				
				public void shutdownCompleted(ShutdownSignalException arg0) {
					// TODO Auto-generated method stub
					System.out.println("RabbitMQ Connection shutdown");
				}
			});
			_rmqchannel = _rmqconnection.createChannel();
			_rmqchannel.addShutdownListener( new ShutdownListener() {
				
				public void shutdownCompleted(ShutdownSignalException arg0) {
					// TODO Auto-generated method stub
					System.out.println("RabbitMQ Channel shutdown");
				}
			});
			
			_rmqchannel.exchangeDeclare(MessageQueueName, "direct", true);
			_rmqchannel.queueDeclare(MessageQueueName, true, false, false, null);
			_rmqchannel.queueBind(MessageQueueName, MessageQueueName, "*");
			System.out.println("_rmqchannel.isOpen()=" + _rmqchannel.isOpen());
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		
		amqProducer = new QueueProducer(_amqconnection, _amqsession, _rmqconnection, _rmqchannel, MessageQueueName);
		amqConsumer = new QueueConsumer(_amqconnection, _amqsession, _rmqconnection, _rmqchannel, MessageQueueName);
		
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
