import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Spinner, Text, Alert, AlertIcon, Button } from "@chakra-ui/react";

const API_URL = "http://localhost:5001/api/v1/links";

function Link() {
  const { label } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`${API_URL}/${label}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
          },
        });

        const data = await response.json();

        if (data.status === 1 && data.data) {
          window.location.href = data.data;
        } else {
          setError(data.message || "Eroare necunoscută");
          setLoading(false);
        }
      } catch (err) {
        setError("A apărut o eroare la conectarea la server.");
        setLoading(false);
      }
    };

    fetchLink();
  }, [label]);

  return (
    <Box p="4" textAlign="center">
      {loading && (
        <Box
          h={"86vh"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner w={"8rem"} h={"8rem"} thickness="6px" color="blue.400" />
        </Box>
      )}

      {error && (
        <Alert status="error" mb="4">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}

      {error && (
        <Button colorScheme="blue" onClick={() => navigate("/links")}>
          Mergi la link-urile generate
        </Button>
      )}
    </Box>
  );
}

export default Link;
