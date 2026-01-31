# Compiler
CXX := g++
CXXFLAGS := -std=c++17 -Wall -I./src
SFML_LIBS := -lsfml-audio -lsfml-system

# Directories
BUILD_DIR := build
SRC_DIR := src

# Source files
SOURCES := $(wildcard $(SRC_DIR)/*.cpp)
OBJECTS := $(patsubst $(SRC_DIR)/%.cpp, $(BUILD_DIR)/%.o, $(SOURCES))

# Executable
RUN_BIN := $(BUILD_DIR)/mySpotify  # Linux-friendly, no .exe

# Default target
all: $(RUN_BIN)

# Ensure build directory exists
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# Compile source files
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp | $(BUILD_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Link executable
$(RUN_BIN): $(OBJECTS)
	$(CXX) $^ $(SFML_LIBS) -o $@
	@echo "Build complete! Run ./$(RUN_BIN)"

# Run the program
run: $(RUN_BIN)
	./$(RUN_BIN)

# Clean build files
clean:
	rm -rf $(BUILD_DIR)
	@echo "Clean complete!"

.PHONY: all run clean
