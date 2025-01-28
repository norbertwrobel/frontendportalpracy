import React, { useState } from 'react';
import { Input, Button, Stack, Box, Text } from '@chakra-ui/react';

const JobPostSearch = ({ jobPosts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredJobPosts, setFilteredJobPosts] = useState(jobPosts);

    const handleSearch = () => {
        const filtered = jobPosts.filter((job) => {
            const lowercasedQuery = searchQuery.toLowerCase();
            return (
                job.title.toLowerCase().includes(lowercasedQuery) ||
                job.description.toLowerCase().includes(lowercasedQuery) ||
                job.requirements.toLowerCase().includes(lowercasedQuery)
            );
        });
        setFilteredJobPosts(filtered);
    };

    return (
        <Box p={4} width="100%">
            <Stack direction="row" spacing={4}>
                <Input
                    placeholder="Search job posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleSearch}>
                    Search
                </Button>
            </Stack>

            <Box mt={4}>
                {filteredJobPosts.length === 0 ? (
                    <Text>No job posts found</Text>
                ) : (
                    filteredJobPosts.map((job) => (
                        <Box key={job.jobId} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                            <Text fontSize="xl" fontWeight="bold">
                                {job.title}
                            </Text>
                            <Text>{job.description}</Text>
                            <Text color="gray.500">{job.requirements}</Text>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default JobPostSearch;