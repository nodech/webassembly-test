SRCDIR := src
BLDDIR ?= build
DEMODIR := demo

OBJS := $(addprefix $(BLDDIR)/,test.ll test.s test.wast test.wasm)

demo: $(BLDDIR)/test.wasm
	cp $< $(DEMODIR)

all: $(OBJS)
	echo $(OBJS)

$(BLDDIR)/%.ll : $(SRCDIR)/%.c | $(BLDDIR)
	clang-4.0 -emit-llvm --target=wasm32 -S $< -o $@

$(BLDDIR)/%.s : $(BLDDIR)/%.ll
	llc $< -march=wasm32 -o $@

$(BLDDIR)/%.wast: $(BLDDIR)/%.s
	s2wasm $< > $@

$(BLDDIR)/%.wasm: $(BLDDIR)/%.wast
	wast2wasm $< -o $@

$(BLDDIR):
	mkdir $(BLDDIR)

clean:
	rm -rf $(BLDDIR)
	rm $(DEMODIR)/test.wasm
