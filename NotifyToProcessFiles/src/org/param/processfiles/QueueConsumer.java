package org.param.processfiles;
import java.io.IOException;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQSession;
import org.apache.activemq.command.ActiveMQQueue;
import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringEscapeUtils;

import com.google.gson.Gson;

public class QueueConsumer  {
	

	private static ActiveMQSession _amqSession;
	private static MessageConsumer _amqConsumer;

	private static com.rabbitmq.client.Connection _rmqconnection;
	private static com.rabbitmq.client.Channel _rmqchannel;

	private static String _queueName;
	
	public QueueConsumer(ActiveMQConnection amqConnection, ActiveMQSession amqSession, com.rabbitmq.client.Connection rmqconnection, com.rabbitmq.client.Channel rmqchannel, String queueName)
	{
		try 
		{
			_queueName = queueName;
			_amqSession = amqSession;
	        _rmqconnection = rmqconnection;
	        _rmqchannel = rmqchannel;
			
			ActiveMQQueue topic = new ActiveMQQueue(queueName);
			_amqConsumer = _amqSession.createConsumer(topic);
			_amqConsumer.setMessageListener(new MessageListener() 
			{
				public void onMessage(Message message) 
				{
			        if (message instanceof TextMessage) 
			        {
			        	TextMessage tMessage = (TextMessage)message;
			            try 
			            {
			            	String esJson = StringEscapeUtils.unescapeJava(tMessage.getText());

			            	Gson gson = new Gson();
			            	CorpMessage corpMessage = new CorpMessage();
			            	corpMessage = gson.fromJson(esJson, corpMessage.getClass());
			            	System.out.println("Received Active message JAVA: " + esJson );
			            } 
			            catch (JMSException ex) 
			            {
			                System.out.println("Error reading message: " + ex);
			            }
			        } 
			        else if (message instanceof ObjectMessage) 
			        {
			        	ObjectMessage objMessage = (ObjectMessage)message;
			            try 
			            {
			            	CorpMessage corpMessage = (CorpMessage) objMessage.getObject() ;
			            	Gson gson = new Gson();
			            	String sGson = gson.toJson(corpMessage, corpMessage.getClass());
			            	String esJson = StringEscapeUtils.unescapeJava(sGson);
				            System.out.println("Received Active message JAVA: " + esJson );
			            } catch (JMSException ex) 
			            {
			                System.out.println("Error reading message: " + ex);
			            }
			        } 
			        else  
			        {
			            System.out.println("Received: " + message);
			        }
				}
			});
			
			
			
			boolean autoAck = false;
			
			com.rabbitmq.client.Consumer rmqconsumer = new com.rabbitmq.client.DefaultConsumer(_rmqchannel) {
		         @Override
		         public void handleDelivery(String consumerTag,
		        		 com.rabbitmq.client.Envelope envelope,
		        		 					com.rabbitmq.client.AMQP.BasicProperties properties,
		                                    byte[] body)
		             throws IOException
		         {
		             String routingKey = envelope.getRoutingKey();
		             String contentType = properties.getContentType();
		             long deliveryTag = envelope.getDeliveryTag();
		             // (process the message components here ...)

		             String esJson = new String(body);
	            	 Gson gson = new Gson();
	            	 CorpMessage corpMessage = new CorpMessage();
	            	 corpMessage = gson.fromJson(esJson, corpMessage.getClass());
		            System.out.println("Received Rabbit message JAVA: " + esJson );
		             _rmqchannel.basicAck(deliveryTag, false);
		         }
		     };

			_rmqchannel.basicConsume(_queueName, autoAck, _queueName, rmqconsumer);
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		System.out.println("Consumer connected to Queue '" + queueName + "'");
	}
	
}
