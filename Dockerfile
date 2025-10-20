FROM public.ecr.aws/lambda/nodejs:22
RUN dnf install -y unzip
RUN curl https://rclone.org/install.sh | bash
WORKDIR /app
COPY rclone.conf rclone.conf
RUN chmod 644 /app/rclone.conf
COPY index.js ${LAMBDA_TASK_ROOT}
CMD [ "index.handler" ]
