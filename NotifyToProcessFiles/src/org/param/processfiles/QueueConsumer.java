package org.param.processfiles;
import com.rabbitmq.client.Consumer;
import com.rabbitmq.client.DefaultConsumer;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.ActiveMQMessageConsumer;
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
			        if (message instanceof ObjectMessage) 
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
			_rmqchannel.basicConsume(_queueName, autoAck, _queueName + "_JAVA",
			     new com.rabbitmq.client.DefaultConsumer(_rmqchannel) {
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
			             CorpMessage corpMessage = (CorpMessage) SerializationUtils.deserialize(body);
			            	Gson gson = new Gson();
			            	String sGson = gson.toJson(corpMessage, corpMessage.getClass());
			            	String esJson = StringEscapeUtils.unescapeJava(sGson);
				            System.out.println("Received Rabbit message JAVA: " + esJson );
			             _rmqchannel.basicAck(deliveryTag, false);
			         }
			     });
		}
		catch (Exception e)
		{
	        System.out.println("Exception occured.  Shutting down client.");
		}
		System.out.println("Consumer connected to Queue '" + queueName + "'");
	}
	
}
