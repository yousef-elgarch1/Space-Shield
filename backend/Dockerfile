# Production image - no build step
FROM nginx:alpine

# Copy your locally built files
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add compression for static assets
RUN apk add --no-cache brotli && \
    find /usr/share/nginx/html -type f -regex ".*\.\(js\|css\|svg\|json\)" -exec gzip -9 -k {} \; && \
    find /usr/share/nginx/html -type f -regex ".*\.\(js\|css\|svg\|json\)" -exec brotli -9 -k {} \; || true

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Use non-root user for better security
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]