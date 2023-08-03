{
  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        packages = with pkgs; [
          hurl
          miniserve
          bat
          fnm
          zellij
          just
          wget
          git
          tree
          unzip
          iproute2
          helix
          cocogitto
          difftastic
          watchexec
          hexyl
          vscodium
          nixd
          nixpkgs-fmt
        ];
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = packages;

          shellHook =
            ''
              codium .
              zellij
            '';
        };
      });
}
