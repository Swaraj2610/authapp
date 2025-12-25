package com.oauth.authentication.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info =
            @Info(
                    title = "Auth Application",
                    description = "Authentication of user using Oauth2.0 Google and Github",
                    contact = @Contact(name = "swaraj", url = "https://authapp.com", email = "support@gamil.com"),
                    version = "1.0",
                    summary = "This is an authentication app useful for login and authentication in gateway"
            ),
            security = {@SecurityRequirement(
                    name = "bearerAuth"
                )
            }
)
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP,scheme = "bearer",bearerFormat = "JWT")
public class ApiDocConfig {

}
