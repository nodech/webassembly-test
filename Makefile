SRCDIR := src
BLDDIR ?= build
DEMODIR := demo

FILES := $(basename $(notdir $(wildcard $(SRCDIR)/*.c)))
OBJNAMES := $(FILES:=.ll) $(FILES:=.s) $(FILES:=.wast) $(FILES:=.wasm)
OBJS := $(addprefix $(BLDDIR)/,$(OBJNAMES))

demo: $(addprefix $(BLDDIR)/,$(FILES:=.wasm))
	cp $(BLDDIR)/*.wasm $(DEMODIR)

all: $(OBJS)

$(BLDDIR)/%.ll : $(SRCDIR)/%.c | $(BLDDIR)
	clang-4.0 -emit-llvm  -I../build/llvm/tools/clang/test/Modules/Inputs/System/usr/include/ --target=wasm32 -S $< -o $@

$(BLDDIR)/%.s : $(BLDDIR)/%.ll
	llc $< -march=wasm32 -o $@

$(BLDDIR)/%.wast: $(BLDDIR)/%.s
	s2wasm -s 8 $< -o $@

$(BLDDIR)/%.wasm: $(BLDDIR)/%.wast
	wast2wasm $< -o $@

$(BLDDIR):
	mkdir $(BLDDIR)

clean:
	rm -rf $(BLDDIR)
	rm $(DEMODIR)/*.wasm
