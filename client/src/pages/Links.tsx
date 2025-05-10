import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  useColorMode,
  IconButton,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { FiPlus, FiTrash, FiSave, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { MdEditNote } from "react-icons/md";
import { validateEmail } from "../utils/validateEmail";

const API_URL = "http://localhost:5001/api/v1/links";

interface Link {
  id: number;
  url: string;
  label?: string;
  access: "public" | "private" | "restricted";
  allowed_emails?: string[];
}

function Links() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedAccess, setSelectedAccess] = useState<string>("");
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [newLink, setNewLink] = useState<Omit<Link, "id">>({
    url: "",
    label: "",
    access: "private",
    allowed_emails: [],
  });
  const [emailInput, setEmailInput] = useState<string>("");

  const fetchLinks = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
        },
      });
      const data = await response.json();
      setLinks(data.data);
      setFilteredLinks(data.data);
    } catch (error) {
      console.error("Eroare la obținerea link-urilor:", error);
    }
  };

  const filterLinks = (): void => {
    let filtered = links?.filter(
      (link) =>
        link.url.toLowerCase().includes(searchInput.toLowerCase()) ||
        link.label?.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (selectedAccess) {
      filtered = filtered.filter((link) => link.access === selectedAccess);
    }

    setFilteredLinks(filtered);
  };

  useEffect(() => {
    filterLinks();
  }, [searchInput, selectedAccess]);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedLink(null);
      setNewLink((prev) => {
        return { ...prev, allowed_emails: [] };
      });
    }
  }, [isOpen]);

  const columns: ColDef<Link>[] = [
    { headerName: "URL", field: "url", flex: 2 },
    { headerName: "Label", field: "label", flex: 1 },
    { headerName: "Acces", field: "access", flex: 1 },
    {
      headerName: "Link Generat",
      field: "label",
      flex: 2,
      cellRenderer: (params: any) => {
        const label = params.value as string;
        if (!label) return "-";
        const generatedUrl = `${window.location.origin}/links/${label}`;
        return (
          <a href={generatedUrl} target="_blank">
            {generatedUrl}
          </a>
        );
      },
    },
    {
      headerName: "",
      maxWidth: 64,
      pinned: "right",
      sortable: false,
      suppressMovable: true,
      resizable: false,
      cellRenderer: (params: any) => {
        return (
          <IconButton
            icon={<MdEditNote fontSize={"24px"} />}
            pos={"relative"}
            top={"6px"}
            aria-label="Edit"
            variant={"link"}
            _hover={{
              color: "blue.800",
            }}
            isDisabled={
              params?.data?.isInvited && params?.data?.isInvited === true
            }
            onClick={() => {
              setSelectedLink(params.data);
              setNewLink({
                url: params.data.url,
                label: params.data.label || "",
                access: params.data.access,
                allowed_emails: params.data.allowed_emails || [],
              });
              onOpen();
            }}
          />
        );
      },
    },
  ];

  const addEmail = () => {
    if (
      emailInput &&
      validateEmail(emailInput) &&
      !newLink.allowed_emails?.includes(emailInput)
    ) {
      setNewLink({
        ...newLink,
        allowed_emails: [...(newLink.allowed_emails || []), emailInput],
      });
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setNewLink({
      ...newLink,
      allowed_emails: newLink.allowed_emails?.filter((e) => e !== email) || [],
    });
  };

  const addNewLink = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
        },
        body: JSON.stringify({ ...newLink, url: `https://${newLink.url}` }),
      });
      const data = await response.json();
      if (data.status === 0) {
        toast({
          title: "Error",
          status: "error",
          description: data.message,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Success",
        status: "success",
        description: "Link adaugat cu succes",
        isClosable: true,
      });
      fetchLinks();
      onAddClose();
      setNewLink({ url: "", label: "", access: "private", allowed_emails: [] });
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: "Eroare la adaugarea link-ului",
        isClosable: true,
      });
    }
  };

  const editLink = async (): Promise<void> => {
    if (!selectedLink) return;
    try {
      await fetch(`${API_URL}/${selectedLink.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
        },
        body: JSON.stringify({
          ...selectedLink,
          allowed_emails: newLink.allowed_emails ?? [],
        }),
      });
      fetchLinks();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: "Eroare la editarea link-ului",
        isClosable: true,
      });
    }
  };

  const deleteLink = async (): Promise<void> => {
    if (!selectedLink) return;
    try {
      await fetch(`${API_URL}/${selectedLink.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth") || ""}`,
        },
      });
      fetchLinks();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: "Eroare la stergerea link-ului",
        isClosable: true,
      });
    }
  };

  return (
    <Box className="linksPageContainer" p={"1rem"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="1rem"
      >
        <Box display={"flex"} alignItems={"center"} gap={"1.25rem"}>
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input
              maxW={240}
              type={"search"}
              variant={"flushed"}
              placeholder="Caută un link..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </InputGroup>
          <Select
            maxW={140}
            placeholder="Acces"
            onChange={(e) => setSelectedAccess(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Privat</option>
            <option value="restricted">Restrictionat</option>
          </Select>
        </Box>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={() => {
            setNewLink({
              url: "",
              label: "",
              access: "private",
              allowed_emails: [],
            });
            onAddOpen();
          }}
        >
          Adauga Link
        </Button>
      </Box>

      <Box
        className={
          colorMode === "light" ? "ag-theme-quartz" : "ag-theme-quartz-dark"
        }
        h={"calc(100vh - 160px)"}
        mt={"1rem"}
      >
        <AgGridReact<Link>
          rowData={filteredLinks}
          columnDefs={columns}
          pagination={true}
          paginationAutoPageSize={true}
          enableCellTextSelection={true}
        />
      </Box>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adauga un link</ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                placeholder="URL"
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
                mb="1rem"
              />
            </InputGroup>

            <Select
              value={newLink.access}
              onChange={(e) =>
                setNewLink({
                  ...newLink,
                  access: e.target.value as "public" | "private" | "restricted",
                })
              }
            >
              <option value="public">Public</option>
              <option value="private">Privat</option>
              <option value="restricted">Restrictionat</option>
            </Select>
            {newLink.access !== "public" && (
              <Input
                placeholder="Label"
                value={newLink.label}
                onChange={(e) =>
                  setNewLink({ ...newLink, label: e.target.value })
                }
                mt="1rem"
              />
            )}
            {newLink.access === "restricted" && (
              <Box mt="1rem">
                <FormLabel>
                  Adauga lista de email-uri care au acces la link
                </FormLabel>
                <HStack>
                  <Input
                    w={"100%"}
                    placeholder="Email"
                    type={"email"}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <Button
                    onClick={addEmail}
                    colorScheme="blue"
                    isDisabled={emailInput.length === 0}
                  >
                    Adauga
                  </Button>
                </HStack>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  w={"100%"}
                  flexWrap={"wrap"}
                  gap={"0.5rem"}
                  mt={"1rem"}
                >
                  {newLink.allowed_emails?.map((email) => (
                    <Tag key={email}>
                      <TagLabel>{email}</TagLabel>
                      <TagCloseButton onClick={() => removeEmail(email)} />
                    </Tag>
                  ))}
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter pt={newLink.access === "restricted" ? 0 : undefined}>
            <Button colorScheme="blue" onClick={addNewLink}>
              Salveaza
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedLink && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Editare Link</DrawerHeader>
            <DrawerBody>
              <Input
                value={selectedLink.url}
                onChange={(e) =>
                  setSelectedLink({ ...selectedLink, url: e.target.value })
                }
                mb="1rem"
              />
              <Select
                value={selectedLink.access}
                onChange={(e) =>
                  setSelectedLink({
                    ...selectedLink,
                    access: e.target.value as
                      | "public"
                      | "private"
                      | "restricted",
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Privat</option>
                <option value="restricted">Restrictionat</option>
              </Select>
              {selectedLink.access !== "public" && (
                <Input
                  value={selectedLink.label}
                  onChange={(e) =>
                    setSelectedLink({ ...selectedLink, label: e.target.value })
                  }
                  mt="1rem"
                />
              )}
              {selectedLink.access === "restricted" && (
                <Box mt="1rem">
                  <HStack>
                    <Input
                      placeholder="Email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <Button onClick={addEmail} colorScheme="blue">
                      Adauga
                    </Button>
                  </HStack>
                  <Box
                    mt={"1rem"}
                    display={"flex"}
                    flexDir={"column"}
                    gap={"0.5rem"}
                  >
                    {newLink.allowed_emails?.map((email) => (
                      <Tag
                        key={email}
                        w={"100%"}
                        colorScheme="green"
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        p={"6px"}
                      >
                        <TagLabel fontSize={"14px"} fontWeight={600}>
                          {email}
                        </TagLabel>
                        <TagCloseButton onClick={() => removeEmail(email)} />
                      </Tag>
                    ))}
                  </Box>
                </Box>
              )}
            </DrawerBody>
            <DrawerFooter display={"flex"} gap={"8px"} alignItems={"center"}>
              <Button
                flex={1}
                leftIcon={<FiSave />}
                colorScheme="green"
                onClick={editLink}
              >
                Salveaza
              </Button>
              <Button
                flex={1}
                leftIcon={<FiTrash />}
                colorScheme="red"
                onClick={deleteLink}
              >
                Sterge
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}

export default Links;
