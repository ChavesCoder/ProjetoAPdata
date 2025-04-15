package school.sptech;

public class S3Provider {

    private final AwsSessionCredentials credentials;

    public S3Provider() {
        this.credentials = AwsSessionCredentials.create(
                System.getenv("AWS_ACCESS_KEY_ID"),
                System.getenv("AWS_SECRET_ACCESS_KEY"),
                System.getenv("AWS_SESSION_TOKEN")
        );
    }

    public S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(() -> credentials)
                .build();
    }

    List<Bucket> buckets = s3Client.listBuckets().buckets();
    for(Bucket bucket :buckets){
        System.out.println("Bucket: " + bucket.name());
    }

    ListObjectsRequest listObjects = ListObjectsRequest.builder()
            .bucket("nome-do-bucket")
            .build();

    List<S3Object> objects = s3Client.listObjects(listObjects).contents();
    for (S3Object object : objects) {
        System.out.println("Objeto: " + object.key());
    }
}
