// Facebook config
ServiceConfiguration.configurations.upsert(
  	{ service: 'facebook' },
  	{
	    $set: {
			appId: '809333382485791',
			secret: '0930954401c085c6b1f5828535e93bd2'
	    }
  	}
);

// Twitter config
ServiceConfiguration.configurations.upsert(
    { service: 'twitter' },
    {
    	$set: {
    		consumerKey: 'PcB0jcfP4MnL9u6WMVhEIEqax',
	        secret: 'aGUkT16sm2pY1ZUWnvdkKfiNlnlUAWgqWXyd3mN61d9LlSzV69'
    	}
	}
);
