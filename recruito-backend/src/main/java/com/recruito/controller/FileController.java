package com.recruito.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    // Store uploads in a fixed directory under the user's home to avoid temp/work dirs
    private static final Path UPLOAD_DIR = Paths
            .get(System.getProperty("user.home"), "recruito-uploads")
            .toAbsolutePath()
            .normalize();

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        Files.createDirectories(UPLOAD_DIR);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String storedFileName = UUID.randomUUID() + extension;
        Path destination = UPLOAD_DIR.resolve(storedFileName);
        file.transferTo(destination.toFile());

        String url = "/files/" + storedFileName;
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        response.put("fileName", originalFilename != null ? originalFilename : storedFileName);
        return ResponseEntity.ok(response);
    }
}


