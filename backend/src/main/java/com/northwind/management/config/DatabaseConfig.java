package com.northwind.management.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(Environment env) {
        String mysqlUrl = env.getProperty("MYSQL_URL");
        String databaseUrl = env.getProperty("DATABASE_URL");
        String host = env.getProperty("MYSQLHOST", "localhost");
        String port = env.getProperty("MYSQLPORT", "3306");
        String database = env.getProperty("MYSQLDATABASE", "Northwind");
        String user = env.getProperty("MYSQLUSER", env.getProperty("spring.datasource.username", "root"));
        String password = env.getProperty("MYSQLPASSWORD", env.getProperty("spring.datasource.password", "loki"));

        String finalJdbcUrl;
        String finalUser = user;
        String finalPassword = password;

        if (mysqlUrl != null && !mysqlUrl.isBlank()) {
            log.info("Parsing DataSource configuration from MYSQL_URL");
            try {
                String cleanUrl = mysqlUrl.startsWith("jdbc:") ? mysqlUrl.substring(5) : mysqlUrl;
                URI uri = new URI(cleanUrl);
                String uriHost = uri.getHost();
                int uriPort = uri.getPort() > 0 ? uri.getPort() : 3306;
                String uriPath = uri.getPath(); // e.g. /railway
                if (uriPath != null && uriPath.startsWith("/")) {
                    database = uriPath.substring(1);
                }
                host = uriHost;
                port = String.valueOf(uriPort);

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    finalUser = parts[0];
                    if (parts.length > 1) {
                        finalPassword = parts[1];
                    }
                }
                finalJdbcUrl = "jdbc:mysql://" + uriHost + ":" + uriPort + "/" + database
                        + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&cachePrepStmts=true&prepStmtCacheSize=250&prepStmtCacheSqlLimit=2048&useServerPrepStmts=true&rewriteBatchedStatements=true";
            } catch (Exception e) {
                log.warn("Could not parse MYSQL_URL, using individual parameters: {}", e.getMessage());
                finalJdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database
                        + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&cachePrepStmts=true&prepStmtCacheSize=250&prepStmtCacheSqlLimit=2048&useServerPrepStmts=true&rewriteBatchedStatements=true";
            }
        } else if (databaseUrl != null && !databaseUrl.isBlank()) {
            if (databaseUrl.startsWith("mysql://")) {
                finalJdbcUrl = "jdbc:" + databaseUrl;
            } else {
                finalJdbcUrl = databaseUrl;
            }
        } else {
            finalJdbcUrl = "jdbc:mysql://" + host + ":" + port + "/" + database
                    + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&cachePrepStmts=true&prepStmtCacheSize=250&prepStmtCacheSqlLimit=2048&useServerPrepStmts=true&rewriteBatchedStatements=true";
        }

        log.info("Connecting to MySQL at host='{}', port='{}', database='{}', user='{}'", host, port, database, finalUser);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(finalJdbcUrl);
        config.setUsername(finalUser);
        config.setPassword(finalPassword);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        config.setPoolName("NorthwindHikariPool");

        return new HikariDataSource(config);
    }
}
