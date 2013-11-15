package org.param.processfiles;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.TimerTask;

import javax.jms.*;

import org.apache.activemq.ActiveMQConnection;
import org.apache.activemq.ActiveMQConnectionFactory;

public class TimedNotifier extends TimerTask {

	private static String MessageHost = "tcp://localhost";
	private static String MessageHostPort = "61616";
	private static String MessageQueueName = "ProcessFiles";
	private static String MessagePublisher = "NotifyToProcessFiles";
		
	private int times = 0;
	public void run()  {
		times++;
		if (times < 6)
		{
			
			ConnectionFactory connectionFactory;
			try {
				connectionFactory = new ActiveMQConnectionFactory(new URI(MessageHost + ":" + MessageHostPort));
				Connection connection = connectionFactory.createConnection();
				Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
				Destination destination = session.createQueue(MessageQueueName);
				MessageProducer producer = session.createProducer(destination);
				TextMessage message = session.createTextMessage("Hello .NET from Java count =" + times);
				producer.send(message);
				System.out.println("Sent message '" + message.getText() + "'");
			} catch (JMSException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		else
		{
			System.out.println("Stoping Timer.");
			this.cancel();
		}
		
	}

}
