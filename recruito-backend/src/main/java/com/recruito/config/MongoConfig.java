package com.recruito.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.recruito.repository")
public class MongoConfig {
    // MongoDB configuration
    // Connection details are configured via application.properties
    // @EnableMongoAuditing ensures @CreatedDate and @LastModifiedDate annotations work automatically
}
