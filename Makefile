# Define a variable for the Tailwind CSS input file
TAILWIND_INPUT = ./src/tailwind.css

# Define a variable for the Tailwind CSS output file
TAILWIND_OUTPUT = ./assets/tailwind.css

# Default target: if you just run 'make', it will run this target
.PHONY: default
default: watch-tailwind

# Target to watch for changes in Tailwind CSS files and recompile
.PHONY: watch-tailwind
watch-tailwind:
	@echo "Starting Tailwind CSS watch mode..."
	npx @tailwindcss/cli -i $(TAILWIND_INPUT) -o $(TAILWIND_OUTPUT) --watch