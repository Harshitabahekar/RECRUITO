package com.recruito.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from /files/**, using the same root as FileController
        Path uploadDir = Paths
                .get(System.getProperty("user.home"), "recruito-uploads")
                .toAbsolutePath()
                .normalize();

        String uploadPath = uploadDir.toUri().toString();

        registry
                .addResourceHandler("/files/**")
                .addResourceLocations(uploadPath);
    }
}



